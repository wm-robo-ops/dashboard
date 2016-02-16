/**
 * Copied from ImageFrame and modified
 */
package Dashboard;

import java.awt.Dimension;
import java.awt.Graphics;
//import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.lang.reflect.InvocationTargetException;

import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

/**
* Displays a {@link BufferedImage} in a {@link JFrame}. Helpful for
* building quick and simple video players.
* 
* ImageFrame methods can be called from any thread, but all UI updating will get
* done on the main Swing UI thread. With the exception of the constructor,
* all public methods return without blocking on the UI thread.
* 
* @author aclarke
*
*/
public class VideoPanel extends JPanel
{

 /**
  * To avoid a warning... 
  */

 private static final long serialVersionUID = -4752966848100689153L;
 private final ImageComponent mOnscreenPicture;
 public JFrame frame;
 
 //private static boolean mIsHeadless = GraphicsEnvironment.isHeadless();

 /**
  * Create the frame
  */

 //public static VideoPanel make() {
 //  return mIsHeadless ? null : new VideoPanel();
 //}
 public VideoPanel(JFrame frame)
 {
   super();
   this.frame = frame;
   frame.add(this);
   mOnscreenPicture = new ImageComponent();
   final VideoPanel thisClosure = this;
   try {
     SwingUtilities.invokeAndWait(new Runnable() {
       public void run() {
         //setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
         //getContentPane().add(mOnscreenPicture);
         thisClosure.add(mOnscreenPicture);
         thisClosure.setVisible(true);
         //thisClosure.pack();
       }
     });
   } catch (InterruptedException e) {
     throw new RuntimeException("The UI thread got interrupted; fail");
   } catch (InvocationTargetException e) {
     throw new RuntimeException("The UI thread could not execute our closure; fail");
   }
 }
 
 public void setImage(final Image aImage)
 {
   mOnscreenPicture.setImage(aImage);
 }

 public class ImageComponent extends JComponent
 {
   /**
    * yeah... good idea to add this.
    */
   private static final long serialVersionUID = 5584422798735147930L;
   private Image mImage;
   private Dimension mSize;

   public void setImage(Image image)
   {
     SwingUtilities.invokeLater(new ImageRunnable(image));
   }
   
   public void setImageSize(Dimension newSize)
   {
   }
   
   private class ImageRunnable implements Runnable
   {
     private final Image newImage;

     public ImageRunnable(Image newImage)
     {
       super();
       this.newImage = newImage;
     }
 
     public void run()
     {
       ImageComponent.this.mImage = newImage;
       final Dimension newSize = new Dimension(mImage.getWidth(null), 
         mImage.getHeight(null));
       if (!newSize.equals(mSize))
       {
         ImageComponent.this.mSize = newSize;
         VideoPanel.this.setSize(mImage.getWidth(null), mImage.getHeight(null));
         VideoPanel.this.setVisible(true);
         VideoPanel.this.frame.pack();
         //ImageFrame.this.setSize(mImage.getWidth(null), mImage.getHeight(null));
         //ImageFrame.this.setVisible(true);
       }
       repaint();
     }
   }
   
   public ImageComponent()
   {
     mSize = new Dimension(0, 0);
     setSize(mSize);
   }

   public synchronized void paint(Graphics g)
   {
     if (mImage != null)
       g.drawImage(mImage, 0, 0, this);
   }
 }
}